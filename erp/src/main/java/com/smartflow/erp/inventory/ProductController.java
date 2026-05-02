package com.smartflow.erp.inventory;

import com.smartflow.erp.auth.User;
import com.smartflow.erp.auth.UserRepository;
import com.smartflow.erp.notification.Notification;
import com.smartflow.erp.notification.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/inventory")
@RequiredArgsConstructor
public class ProductController {

    private final ProductRepository productRepository;
    private final StockMovementRepository stockMovementRepository;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productRepository.findAll());
    }

    @GetMapping("/ledger")
    public ResponseEntity<List<StockMovement>> getLedger() {
        return ResponseEntity.ok(stockMovementRepository.findAllByOrderByTimestampDesc());
    }

    @GetMapping("/{id}/ledger")
    public ResponseEntity<List<StockMovement>> getProductLedger(@PathVariable Long id) {
        return ResponseEntity.ok(stockMovementRepository.findByProductIdOrderByTimestampDesc(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        return ResponseEntity.ok(productRepository.save(product));
    }

    // B21: Check stock level after any stock update
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        return productRepository.findById(id)
                .map(product -> {
                    int previousQty = product.getStockQuantity();
                    product.setName(productDetails.getName());
                    product.setDescription(productDetails.getDescription());
                    product.setSku(productDetails.getSku());
                    product.setUnitPrice(productDetails.getUnitPrice());
                    product.setCostPrice(productDetails.getCostPrice());
                    product.setStockQuantity(productDetails.getStockQuantity());
                    product.setMinStockLevel(productDetails.getMinStockLevel());
                    product.setLocation(productDetails.getLocation());
                    product.setCategory(productDetails.getCategory());
                    Product saved = productRepository.save(product);

                    // B21: Alert when stock falls to or below min level
                    int newQty = saved.getStockQuantity();
                    int minLevel = saved.getMinStockLevel() != null ? saved.getMinStockLevel() : 5;
                    if (newQty <= minLevel && newQty < previousQty) {
                        sendStockLowNotification(saved, newQty);
                    }

                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ---------------------------------------------------------------- B21 helper
    private void sendStockLowNotification(Product product, int currentQty) {
        List<User> adminManagers = userRepository.findAll().stream()
                .filter(u -> u.getRole() == User.Role.ADMIN || u.getRole() == User.Role.MANAGER)
                .toList();

        for (User recipient : adminManagers) {
            Notification notification = Notification.builder()
                    .title("Low Stock Alert: " + product.getName())
                    .message("Product '" + product.getName() + "' (SKU: " + product.getSku()
                            + ") has fallen to " + currentQty + " units, at or below the minimum stock level of "
                            + product.getMinStockLevel() + ".")
                    .recipient(recipient)
                    .build();
            notificationRepository.save(notification);
        }
    }
}
