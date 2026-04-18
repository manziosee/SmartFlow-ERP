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

    public List<Map<String, Object>> getInsights() {
        String url = aiServiceUrl + "/insights";
        return restTemplate.getForObject(url, List.class);
    }

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
