package gmail.bssushant2003.JourneyCraft.DTO;

import gmail.bssushant2003.JourneyCraft.Entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private long id;

    private String name;

    private String email;

    private User.Role role;
}
