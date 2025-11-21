package hsf302.fa25.s3.model;

import lombok.*;

@Builder
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Tower {
    private int towerId;
    private int stationId;
    private int towerNumber;
    private String status;
}
