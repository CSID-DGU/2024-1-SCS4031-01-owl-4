package org.dgu.backend.util;

import org.dgu.backend.exception.NumberErrorResult;
import org.dgu.backend.exception.NumberException;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Objects;

@Component
public class NumberUtil {
    public Double round(Double value, int places) {
        if (places < 0) {
            throw new NumberException(NumberErrorResult.INVALID_NEGATIVE_DECIMAL);
        }
        if (Objects.isNull(value) || value.isNaN()) {
            throw new NumberException(NumberErrorResult.VALUE_NOT_FOUND);
        }
        if (value.isInfinite()) {
            throw new NumberException(NumberErrorResult.VALUE_IS_INFINITE);
        }

        BigDecimal bd = BigDecimal.valueOf(value);
        bd = bd.setScale(places, RoundingMode.HALF_UP);
        return bd.doubleValue();
    }
}