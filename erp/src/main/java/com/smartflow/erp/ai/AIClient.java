package com.smartflow.erp.ai;

import com.smartflow.erp.invoice.Invoice;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AIClient {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${ai.service.url:http://localhost:8000/api/v1/ai}")
    private String aiServiceUrl;

    @Value("${rules.service.url:http://localhost:8001/api/v1/rules}")
    private String rulesServiceUrl;

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getInsights(String role) {
        String url = String.format("%s/insights?role=%s", aiServiceUrl, role);
        return restTemplate.getForObject(url, List.class);
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> getPeerComparison(Long clientId) {
        String url = String.format("%s/peer-comparison?client_id=%s", aiServiceUrl, clientId);
        return restTemplate.getForObject(url, Map.class);
    }

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getMarketplaceRecommendations(Map<String, Object> clientProfile) {
        String url = rulesServiceUrl + "/marketplace";
        return restTemplate.postForObject(url, clientProfile, List.class);
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> getAllocationStrategy(double amount, List<Map<String, Object>> invoices) {
        String url = rulesServiceUrl + "/allocate";
        Map<String, Object> request = new HashMap<>();
        request.put("payment_amount", amount);
        request.put("invoices", invoices);

        return restTemplate.postForObject(url, request, Map.class);
    }

    @SuppressWarnings("unchecked")
    public Double getInvoiceRisk(Invoice invoice) {
        String url = String.format("%s/risk/%s?amount=%s&days_overdue=%d&client_risk_index=%d",
                aiServiceUrl,
                invoice.getId(),
                invoice.getAmount(),
                0, // TODO: Calculate actual days overdue
                invoice.getClient().getRiskIndex()
        );
        
        Map<String, Object> response = restTemplate.getForObject(url, Map.class);
        return response != null ? (Double) response.get("risk_score") : 0.0;
    }

    @SuppressWarnings("unchecked")
    public String predictPaymentDate(Invoice invoice) {
        String url = String.format("%s/predict-payment?invoice_id=%s&due_date=%s&client_avg_delay=%d",
                aiServiceUrl,
                invoice.getId(),
                invoice.getDueDate().toString(),
                invoice.getClient().getAveragePaymentDelayDays()
        );
        
        Map<String, Object> response = restTemplate.postForObject(url, null, Map.class);
        return response != null ? (String) response.get("predicted_date") : invoice.getDueDate().toString();
    }
}
