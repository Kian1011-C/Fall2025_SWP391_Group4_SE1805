package hsf302.fa25.s3.model;

import lombok.*;

@Builder
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Station {
    private int stationId;
    private String name;
    private String location;
    private String status;
    private Double latitude;
    private Double longitude;
}
