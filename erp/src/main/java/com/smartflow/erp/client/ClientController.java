package com.smartflow.erp.client;

import com.smartflow.erp.auth.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientRepository clientRepository;

    @GetMapping
    public ResponseEntity<List<Client>> getClients(@AuthenticationPrincipal User user) {
        // ADMIN, MANAGER, ACCOUNTANT see all
        if (user.getRole() != User.Role.CLIENT) {
            return ResponseEntity.ok(clientRepository.findAll());
        }
        
        // CLIENT only sees their own profile
        if (user.getClientId() != null) {
            return clientRepository.findById(user.getClientId())
                    .map(client -> ResponseEntity.ok(List.of(client)))
                    .orElse(ResponseEntity.ok(List.of()));
        }
        
        return ResponseEntity.ok(List.of());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Client> getClientById(@PathVariable Long id, @AuthenticationPrincipal User user) {
        // Enforce data isolation for CLIENT role
        if (user.getRole() == User.Role.CLIENT && !id.equals(user.getClientId())) {
            return ResponseEntity.status(403).build();
        }
        
        return clientRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Client> createClient(@RequestBody Client client) {
        return ResponseEntity.ok(clientRepository.save(client));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Client> updateClient(@PathVariable Long id, @RequestBody Client clientDetails, @AuthenticationPrincipal User user) {
        // Enforce data isolation for CLIENT role
        if (user.getRole() == User.Role.CLIENT && !id.equals(user.getClientId())) {
            return ResponseEntity.status(403).build();
        }

        return clientRepository.findById(id).map(client -> {
            client.setName(clientDetails.getName());
            client.setEmail(clientDetails.getEmail());
            client.setPhone(clientDetails.getPhone());
            client.setContactPerson(clientDetails.getContactPerson());
            client.setCompany(clientDetails.getCompany());
            client.setAddress(clientDetails.getAddress());
            client.setIndustry(clientDetails.getIndustry());
            
            // Financials
            if (clientDetails.getLifetimeRevenue() != null) client.setLifetimeRevenue(clientDetails.getLifetimeRevenue());
            if (clientDetails.getTotalPaidAmount() != null) client.setTotalPaidAmount(clientDetails.getTotalPaidAmount());
            if (clientDetails.getMonthlyRate() != null) client.setMonthlyRate(clientDetails.getMonthlyRate());
            if (clientDetails.getPreferredBillingDay() != null) client.setPreferredBillingDay(clientDetails.getPreferredBillingDay());
            if (clientDetails.getRiskIndex() != null) client.setRiskIndex(clientDetails.getRiskIndex());
            if (clientDetails.getRiskScore() != null) client.setRiskScore(clientDetails.getRiskScore());

            return ResponseEntity.ok(clientRepository.save(client));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable Long id, @AuthenticationPrincipal User user) {
        // Only ADMIN or MANAGER can delete clients
        if (user.getRole() == User.Role.CLIENT || user.getRole() == User.Role.ACCOUNTANT) {
            return ResponseEntity.status(403).build();
        }
        
        if (clientRepository.existsById(id)) {
            clientRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
