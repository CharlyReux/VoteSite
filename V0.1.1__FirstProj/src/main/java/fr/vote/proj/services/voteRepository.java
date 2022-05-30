package fr.vote.proj.services;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import fr.vote.proj.domain.vote;

public interface voteRepository extends CrudRepository<vote,Long>{
    
    List<vote> findAll();

}
