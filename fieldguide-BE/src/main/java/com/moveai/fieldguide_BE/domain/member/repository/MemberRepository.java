package com.moveai.fieldguide_BE.domain.member.repository;


import com.moveai.fieldguide_BE.domain.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Long> {
}
