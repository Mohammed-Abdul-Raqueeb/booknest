package com.library.backend.repository;

import com.library.backend.model.BorrowRecord;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BorrowRepository extends JpaRepository<BorrowRecord, Long> {

    List<BorrowRecord> findByStudentId(Long studentId);

    List<BorrowRecord> findByBookId(Long bookId);

    List<BorrowRecord> findByReturnedFalse();

    boolean existsByStudentIdAndBookIdAndReturnedFalse(Long studentId, Long bookId);
}
