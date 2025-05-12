package com.project.demo.services;

import com.project.demo.enums.AssetStatus;
import com.project.demo.dtos.assetDtos.AssetRequest;
import com.project.demo.entities.Asset;
import com.project.demo.entities.AssetHistory;
import com.project.demo.entities.User;
import com.project.demo.repository.AssetHistoryRepository;
import com.project.demo.repository.AssetRepository;
import com.project.demo.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AssetService {

    private final AssetRepository assetRepository;
    private final AssetHistoryRepository historyRepository;
    private final UserRepository userRepo;

    public List<Asset> getAllAssets() {
        return assetRepository.findAll();
    }

    public Asset getAssetById(Long id) {
        return assetRepository.findById(id).orElseThrow();
    }

    public Asset createAsset(AssetRequest assetRequest) {
        Asset asset = new Asset();
        asset.setName(assetRequest.getName());
        if (assetRequest.getStatus() != null) {
            asset.setStatus(AssetStatus.valueOf(assetRequest.getStatus()));
        } else {
            asset.setStatus(AssetStatus.Available);
        }
        if (assetRequest.getAssignedToId() != null) {
            Optional<User> optionalUser = userRepo.findById(assetRequest.getAssignedToId());
            User user = optionalUser.orElseThrow(() -> new RuntimeException("User not found"));
            asset.setAssignedTo(user);
        }
        Asset saved = assetRepository.save(asset);
        addHistory(saved, AssetStatus.Available);
        return saved;
    }

    public Asset updateAsset(Long id, Asset updatedAsset) {
        Asset asset = getAssetById(id);
        asset.setName(updatedAsset.getName());
        asset.setAssignedTo(updatedAsset.getAssignedTo());
        return assetRepository.save(asset);
    }

    public void deleteAsset(Long id) {
        assetRepository.deleteById(id);
    }

    public Asset updateAssetStatus(Long id, AssetStatus status) {
        Asset asset = getAssetById(id);
        asset.setStatus(status);
        addHistory(asset, status);
        return assetRepository.save(asset);
    }

    private void addHistory(Asset asset, AssetStatus status) {
        AssetHistory history = AssetHistory.builder()
                .asset(asset)
                .status(status)
                .timestamp(LocalDateTime.now())
                .build();
        historyRepository.save(history);
    }

    public List<AssetHistory> getAssetHistory(Long assetId) {
        return historyRepository.findByAssetId(assetId);
    }

    public List<User> getEmployees() {

        return userRepo.findAllByRole("USER");
    }
}
