package org.dgu.backend.common.code;


import org.dgu.backend.common.dto.ReasonDto;

public interface BaseCode {
    public ReasonDto getReason();

    public ReasonDto getReasonHttpStatus();
}