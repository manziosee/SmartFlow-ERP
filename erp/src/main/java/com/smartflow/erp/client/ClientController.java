package com.smartflow.erp.client;

import com.smartflow.erp.audit.AuditLogService;
import com.smartflow.erp.auth.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientRepository clientRepository;
    private final AuditLogService auditLogService;

    // ---------------------------------------------------------------- GET all (with optional pagination + sorting)
    @GetMapping
    public ResponseEntity<?> getClients(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        // CLIENT only sees their own profile — no pagination needed
        if (user.getRole() == User.Role.CLIENT) {
            if (user.getClientId() != null) {
                return clientRepository.findById(user.getClientId())
                        .map(client -> ResponseEntity.ok(List.of(client)))
                        .orElse(ResponseEntity.ok(List.of()));
            }
            return ResponseEntity.ok(List.of());
        }

        // Staff: support search
        List<Client> clients = (q != null && !q.isBlank())
                ? clientRepository.searchClients(q)
                : clientRepository.findAll();

        // Sort
        Sort.Direction direction = "desc".equalsIgnoreCase(sortDir) ? Sort.Direction.DESC : Sort.Direction.ASC;
        clients = clients.stream().sorted((a, b) -> {
            try {
                if ("name".equals(sortBy)) {
                    return direction == Sort.Direction.ASC
                            ? a.getName().compareToIgnoreCase(b.getName())
                            : b.getName().compareToIgnoreCase(a.getName());
                }
                if ("email".equals(sortBy)) {
                    String ea = a.getEmail() != null ? a.getEmail() : "";
                    String eb = b.getEmail() != null ? b.getEmail() : "";
                    return direction == Sort.Direction.ASC ? ea.compareToIgnoreCase(eb) : eb.compareToIgnoreCase(ea);
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
            int end = Math.min(start + size, clients.size());
            List<Client> pageContent = start >= clients.size() ? List.of() : clients.subList(start, end);
            Page<Client> pageResult = new PageImpl<>(pageContent, PageRequest.of(page, size), clients.size());
            return ResponseEntity.ok(pageResult);
        }

        return ResponseEntity.ok(clients);
    }

    // ---------------------------------------------------------------- GET by ID
    @GetMapping("/{id}")
    public ResponseEntity<Client> getClientById(@PathVariable Long id, @AuthenticationPrincipal User user) {
        if (user.getRole() == User.Role.CLIENT && !id.equals(user.getClientId())) {
            return ResponseEntity.status(403).build();
        }
        return clientRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ---------------------------------------------------------------- POST create (B7 audit)
    @PostMapping
    public ResponseEntity<Client> createClient(@Valid @RequestBody Client client, Principal principal) {
        Client saved = clientRepository.save(client);
        String performedBy = principal != null ? principal.getName() : "system";
        auditLogService.log("CREATE_CLIENT", "Client", saved.getId(), performedBy,
                "Created client: " + saved.getName());
        return ResponseEntity.ok(saved);
    }

    // ---------------------------------------------------------------- PUT update
    @PutMapping("/{id}")
    public ResponseEntity<Client> updateClient(@PathVariable Long id,
                                               @Valid @RequestBody Client clientDetails,
                                               @AuthenticationPrincipal User user) {
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
            if (clientDetails.getLifetimeRevenue() != null) client.setLifetimeRevenue(clientDetails.getLifetimeRevenue());
            if (clientDetails.getTotalPaidAmount() != null) client.setTotalPaidAmount(clientDetails.getTotalPaidAmount());
            if (clientDetails.getMonthlyRate() != null) client.setMonthlyRate(clientDetails.getMonthlyRate());
            if (clientDetails.getPreferredBillingDay() != null) client.setPreferredBillingDay(clientDetails.getPreferredBillingDay());
            if (clientDetails.getRiskIndex() != null) client.setRiskIndex(clientDetails.getRiskIndex());
            if (clientDetails.getRiskScore() != null) client.setRiskScore(clientDetails.getRiskScore());
            return ResponseEntity.ok(clientRepository.save(client));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ---------------------------------------------------------------- DELETE (B7 audit)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable Long id,
                                             @AuthenticationPrincipal User user,
                                             Principal principal) {
        if (user.getRole() == User.Role.CLIENT || user.getRole() == User.Role.ACCOUNTANT) {
            return ResponseEntity.status(403).build();
        }
        if (!clientRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        String performedBy = principal != null ? principal.getName() : "system";
        auditLogService.log("DELETE_CLIENT", "Client", id, performedBy, "Deleted client id=" + id);
        clientRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
