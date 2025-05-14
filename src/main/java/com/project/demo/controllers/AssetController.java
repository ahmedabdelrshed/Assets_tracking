package com.project.demo.controllers;

import com.project.demo.dtos.assetDtos.AssetRequest;
import com.project.demo.entities.Asset;
import com.project.demo.entities.AssetHistory;
import com.project.demo.entities.User;
import com.project.demo.services.AssetService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/assets")
@RequiredArgsConstructor
public class AssetController {

    private final AssetService assetService;

    @CrossOrigin("*")
    @GetMapping
    public List<Asset> getAllAssets() {
        return assetService.getAllAssets(); 
    }

    @GetMapping("/{id}")
    public Asset getAsset(@PathVariable Long id) {
        return assetService.getAssetById(id);
    }

    @PostMapping
    public Asset createAsset(@RequestBody AssetRequest asset) {

        return assetService.createAsset(asset);
    }

    @PutMapping("/{id}")
    public Asset updateAsset(@PathVariable Long id, @RequestBody AssetRequest asset) {
        return assetService.updateAsset(id, asset);
    }

    @DeleteMapping("/{id}")
    public void deleteAsset(@PathVariable Long id) {
        assetService.deleteAsset(id);
    }

    

    @GetMapping("/{id}/history")
    public List<AssetHistory> getAssetHistory(@PathVariable Long id) {
        return assetService.getAssetHistory(id);
    }
   
    @GetMapping("/asset_user/{id}")
    public List<Asset> getAssetsByUserId(@PathVariable Long id) {
        return assetService.getAssetsByUserId(id);
    }

}
