package org.dgu.backend.common.code;


import org.dgu.backend.common.dto.ErrorReasonDto;

public interface BaseErrorCode {
    public ErrorReasonDto getReason();

    public ErrorReasonDto getReasonHttpStatus();
}