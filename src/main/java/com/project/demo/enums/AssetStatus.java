package com.project.demo.enums;

import jakarta.persistence.criteria.CriteriaBuilder.In;

public enum AssetStatus {
    Available,
    In_Use,
    Under_Maintenance,
}