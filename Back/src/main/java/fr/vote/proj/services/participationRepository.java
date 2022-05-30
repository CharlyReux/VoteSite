package fr.vote.proj.services;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import fr.vote.proj.domain.participation;

public interface participationRepository extends CrudRepository<participation,Long>{
    
    List<participation> findAll();

}
