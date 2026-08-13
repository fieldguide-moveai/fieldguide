package com.moveai.fieldguide_BE.domain.hub.repository;


import com.moveai.fieldguide_BE.domain.hub.entity.Hub;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HubRepository extends JpaRepository<Hub, Long> {
}
