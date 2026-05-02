package com.smartflow.erp.tax;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * B19: Tax calculation engine.
 * Supports VAT_18 (18% Rwanda VAT), VAT_0 (zero-rated), and EXEMPT (no tax).
 */
@Service
public class TaxService {

    private static final BigDecimal VAT_18_RATE = new BigDecimal("0.18");
    private static final BigDecimal ZERO = BigDecimal.ZERO;

    /**
     * Calculate tax for the given gross amount and tax type.
     *
     * @param amount  gross (pre-tax) amount
     * @param taxType one of "VAT_18", "VAT_0", "EXEMPT"
     * @return the tax amount (not the total); returns ZERO for unknown types
     */
    public BigDecimal calculateTax(BigDecimal amount, String taxType) {
        if (amount == null) return ZERO;
        if (taxType == null) taxType = "VAT_18";

        return switch (taxType.toUpperCase()) {
            case "VAT_18" -> amount.multiply(VAT_18_RATE).setScale(2, RoundingMode.HALF_UP);
            case "VAT_0", "EXEMPT" -> ZERO;
            default -> {
                // Treat unknown type as exempt — log-worthy but not fatal
                yield ZERO;
            }
        };
    }
}
