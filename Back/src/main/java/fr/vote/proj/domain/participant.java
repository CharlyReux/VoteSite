package fr.vote.proj.domain;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import com.fasterxml.jackson.annotation.JsonIgnore;

import io.swagger.v3.oas.annotations.media.Schema;

@Entity
public class participant {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    private String name;
    private String mail;

    @Schema(readOnly = true)
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "participant")
    private List<participation> participations;

    @JsonIgnore
    @ManyToOne
    private poll poll;

    // Représentation du nombre de vois par utilisateur
    private long points;

    @Schema(readOnly = true)
    private String DefaultPass;

    public participant() {
    }

    public participant(String name, String mail, long points) {
        this.name = name;
        this.mail = mail;
        this.points = points;
    }


    public boolean hasVoted(int idVote){
        for(participation p:this.participations){
            if(p.getVote().getVoteNumber()==idVote){
                return true;
            } 
        }
        return false;
    }



    public long getPoints() {
        return points;
    }

    public void setPoints(long points) {
        this.points = points;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMail() {
        return mail;
    }

    public void setMail(String mail) {
        this.mail = mail;
    }

    public List<participation> getParticipations() {
        return participations;
    }

    public void setParticipations(List<participation> participations) {
        this.participations = participations;
    }

    public poll getPoll() {
        return poll;
    }

    public void setPoll(poll poll) {
        this.poll = poll;
    }

    public String getDefaultPass() {
        return DefaultPass;
    }

    public void setDefaultPass(String defaultPass) {
        DefaultPass = defaultPass;
    }

    


    
    
}
