package gmail.bssushant2003.JourneyCraft.Repository;

import gmail.bssushant2003.JourneyCraft.Entity.Restaurant;
import gmail.bssushant2003.JourneyCraft.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RestaurantRepository extends JpaRepository<Restaurant,Long> {
    Optional<Restaurant> findByUserId(Long id);
    Optional<Restaurant>findByUser(User user);
    List<Restaurant> findByIsApprovedFalse();
    long countByIsApprovedTrue();
    long countByIsApprovedFalse();
    boolean existsByUserId(Long userId);
}
