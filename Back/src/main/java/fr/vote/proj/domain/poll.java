package fr.vote.proj.domain;

import java.sql.Time;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import fr.vote.proj.Utils.slugGenerator;
import io.swagger.v3.oas.annotations.media.Schema;

@Entity
public class poll {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Schema(readOnly = true)
    private long id;

    private String name;
    private String description;

    @Schema(readOnly = true)
    private String slug=slugGenerator.generateRandomSlug();

    private int currentVote;

    @Schema(readOnly = true)
    private boolean isEnded = false;

    @OneToMany(cascade = CascadeType.ALL,mappedBy = "poll")
    private List<participant> participants;

    @OneToMany(cascade = CascadeType.ALL,mappedBy = "poll")
    private List<vote> votes;

    //admin password
    private String adminPass;

    public poll() {
    }

    public poll(String name, String description, List<participant> participants, List<vote> votes,int currentVote) {
        this.name = name;
        this.description = description;
        this.participants = participants;
        this.votes = votes;
        this.currentVote = currentVote;
    }

    public int nextVote(){
        this.currentVote++;
        if(this.currentVote>votes.size()){
            this.isEnded=true;
        }//TOTEST
       return this.currentVote;
    }




    //Getters and setters 
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<participant> getParticipants() {
        return participants;
    }

    public void setParticipants(List<participant> participants) {
        this.participants = participants;
    }

    public List<vote> getVotes() {
        return votes;
    }

    public void setVotes(List<vote> votes) {
        this.votes = votes;
    }

    public String getSlug() {
        return slug;
    }

    public int getCurrentVote() {
        return currentVote;
    }

    public void setCurrentVote(int currentVote) {
        this.currentVote = currentVote;
    }

    public long getId() {
        return id;
    }

    public boolean isEnded() {
        return isEnded;
    }

    public void setEnded(boolean isEnded) {
        this.isEnded = isEnded;
    }

    public String getAdminPass() {
        return adminPass;
    }

    public void setAdminPass(String adminPass) {
        this.adminPass = adminPass;
    }


}
