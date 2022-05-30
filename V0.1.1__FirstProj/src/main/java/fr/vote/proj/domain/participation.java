package fr.vote.proj.domain;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import com.fasterxml.jackson.annotation.JsonIgnore;

import io.swagger.v3.oas.annotations.media.Schema;

@Entity
public class participation {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    private long pour;
    private long neutre;
    private long contre;

    @ManyToOne
    @JsonIgnore
    private vote vote;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    private participant participant;

    public participation() {
    }

    public participation(long pour, long neutre, long contre, fr.vote.proj.domain.vote vote,
            fr.vote.proj.domain.participant participant) {
        this.pour = pour;
        this.neutre = neutre;
        this.contre = contre;
        this.vote = vote;
        this.participant = participant;
    }

    public long getPour() {
        return pour;
    }

    public void setPour(long pour) {
        this.pour = pour;
    }

    public long getNeutre() {
        return neutre;
    }

    public void setNeutre(long neutre) {
        this.neutre = neutre;
    }

    public long getContre() {
        return contre;
    }

    public void setContre(long contre) {
        this.contre = contre;
    }

    public vote getVote() {
        return vote;
    }

    public void setVote(vote vote) {
        this.vote = vote;
    }

    public participant getParticipant() {
        return participant;
    }

    public void setParticipant(participant participant) {
        this.participant = participant;
    }

}
