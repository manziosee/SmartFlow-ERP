package com.smartflow.erp.vendor;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/vendors")
@RequiredArgsConstructor
public class VendorController {

    private final VendorRepository vendorRepository;

    // ---------------------------------------------------------------- GET all (with optional pagination + sorting)
    @GetMapping
    public ResponseEntity<?> getAllVendors(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        List<Vendor> vendors = (q != null && !q.isBlank())
                ? vendorRepository.searchVendors(q)
                : vendorRepository.findAll();

        // Sort
        Sort.Direction direction = "desc".equalsIgnoreCase(sortDir) ? Sort.Direction.DESC : Sort.Direction.ASC;
        vendors = vendors.stream().sorted((a, b) -> {
            try {
                if ("name".equals(sortBy)) {
                    return direction == Sort.Direction.ASC
                            ? a.getName().compareToIgnoreCase(b.getName())
                            : b.getName().compareToIgnoreCase(a.getName());
                }
                if ("category".equals(sortBy)) {
                    String ca = a.getCategory() != null ? a.getCategory() : "";
                    String cb = b.getCategory() != null ? b.getCategory() : "";
                    return direction == Sort.Direction.ASC ? ca.compareToIgnoreCase(cb) : cb.compareToIgnoreCase(ca);
                }
                // default: createdAt
                if (a.getCreatedAt() == null) return 1;
                if (b.getCreatedAt() == null) return -1;
                return direction == Sort.Direction.ASC
                        ? a.getCreatedAt().compareTo(b.getCreatedAt())
                        : b.getCreatedAt().compareTo(a.getCreatedAt());
            } catch (Exception ex) {
                return 0;
            }
        }).toList();

        // Paginate if requested
        if (page != null && size != null && size > 0) {
            int start = page * size;
            int end = Math.min(start + size, vendors.size());
            List<Vendor> pageContent = start >= vendors.size() ? List.of() : vendors.subList(start, end);
            Page<Vendor> pageResult = new PageImpl<>(pageContent, PageRequest.of(page, size), vendors.size());
            return ResponseEntity.ok(pageResult);
        }

        return ResponseEntity.ok(vendors);
    }

    // ---------------------------------------------------------------- GET by ID
    @GetMapping("/{id}")
    public ResponseEntity<Vendor> getVendorById(@PathVariable Long id) {
        return vendorRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ---------------------------------------------------------------- POST create
    @PostMapping
    public ResponseEntity<Vendor> createVendor(@Valid @RequestBody Vendor vendor) {
        return ResponseEntity.ok(vendorRepository.save(vendor));
    }

    // ---------------------------------------------------------------- PUT update
    @PutMapping("/{id}")
    public ResponseEntity<Vendor> updateVendor(@PathVariable Long id, @Valid @RequestBody Vendor vendorDetails) {
        return vendorRepository.findById(id)
                .map(vendor -> {
                    vendor.setName(vendorDetails.getName());
                    vendor.setEmail(vendorDetails.getEmail());
                    vendor.setPhone(vendorDetails.getPhone());
                    vendor.setContactPerson(vendorDetails.getContactPerson());
                    vendor.setCompany(vendorDetails.getCompany());
                    vendor.setAddress(vendorDetails.getAddress());
                    vendor.setCategory(vendorDetails.getCategory());
                    return ResponseEntity.ok(vendorRepository.save(vendor));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ---------------------------------------------------------------- DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVendor(@PathVariable Long id) {
        vendorRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
