package fr.vote.proj.domain;


import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.fasterxml.jackson.annotation.JsonIgnore;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.AccessMode;

@Entity
public class vote {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Schema(accessMode = AccessMode.READ_ONLY)
    private long id;

    private String title;
    private String description;

    @Schema(readOnly = true)
    private int voteNumber;

    @Schema(readOnly = true)
    @Temporal(TemporalType.TIMESTAMP)
    private Date startTime;

    private Long Duration;

    @Schema(readOnly = true)
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "vote")
    private List<participation> participations;

    @ManyToOne
    @JsonIgnore
    private poll poll;

    @Schema(readOnly = true)
    private boolean enCours;

    public vote() {
    }

    /**
     * 
     * @param title
     * @param description 
     * @param Duration : the number of seconds of the vote
     */
    public vote(String title, String description,Long Duration) {
        this.title = title;
        this.description = description;
        this.Duration = Duration;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public int getVoteNumber() {
        return voteNumber;
    }

    public void setVoteNumber(int voteNumber) {
        this.voteNumber = voteNumber;
    }

    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    public Long getDuration() {
        return Duration;
    }

    public void setDuration(Long Duration) {
        this.Duration = Duration;
    }

    public boolean isEnCours() {
        return enCours;
    }

    public void setEnCours(boolean enCours) {
        this.enCours = enCours;
    }

}
