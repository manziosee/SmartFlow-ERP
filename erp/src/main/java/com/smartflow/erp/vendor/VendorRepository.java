package com.smartflow.erp.vendor;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, Long> {

    @Query("SELECT v FROM Vendor v WHERE " +
           "LOWER(v.name) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(v.email) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(v.company) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<Vendor> searchVendors(@Param("q") String query);
}
