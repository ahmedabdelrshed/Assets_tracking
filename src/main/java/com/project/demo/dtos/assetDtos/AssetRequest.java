package com.project.demo.dtos.assetDtos;

import lombok.Data;

@Data
public class AssetRequest {
    private String name;
    private String status;
    private Long assignedToId;

    // Getters and setters
}
