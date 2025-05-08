package com.project.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.demo.entities.Asset;

public interface AssetRepository extends JpaRepository<Asset, Long> {
}
