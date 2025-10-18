package hsf302.fa25.s3.model;

import lombok.*;

@Builder
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Slot {
    private int slotId;
    private int towerId;
    private int slotNumber;
    private String status;
}
