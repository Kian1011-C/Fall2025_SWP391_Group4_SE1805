package hsf302.fa25.s3.model;

import lombok.*;
import java.sql.Timestamp;


@Builder
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private String userId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String password;
    private String role;
    private String cccd;
    private String status;
    private Timestamp createdAt;
    private Timestamp updatedAt;
}
