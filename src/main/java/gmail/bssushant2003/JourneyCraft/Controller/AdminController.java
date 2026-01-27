package gmail.bssushant2003.JourneyCraft.Controller;

import gmail.bssushant2003.JourneyCraft.Entity.Guide;
import gmail.bssushant2003.JourneyCraft.Entity.Restaurant;
import gmail.bssushant2003.JourneyCraft.Repository.GuideRepository;
import gmail.bssushant2003.JourneyCraft.Repository.RestaurantRepository;
import gmail.bssushant2003.JourneyCraft.Service.FirebaseSyncService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private GuideRepository guideRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private FirebaseSyncService firebaseSyncService;

    @GetMapping("/guide/unapproved")
    public List<Guide> getUnapprovedGuide(){
        return guideRepository.findByIsApprovedFalse();
    }

    @PostMapping("/guide/approve/{id}")
    public ResponseEntity<Map<String,String>> approveGuide(@PathVariable Long id){
        Optional<Guide> optional = guideRepository.findById(id);

        if(optional.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Restaurant Not Found"));
        }

        Guide guide = optional.get();
        guide.setApproved(true);
        guideRepository.save(guide);

        firebaseSyncService.pushGuideToFirebase(guide);
        return ResponseEntity.ok(Map.of("message", "Guide Approved"));
    }

    @GetMapping("/restaurant/unapproved")
    public List<Restaurant> getUnapprovedRestaurants(){
        return restaurantRepository.findByIsApprovedFalse();
    }

    @PostMapping("/restaurant/approve/{id}")
    public ResponseEntity<?> approveRestaurant(@PathVariable Long id){
        Optional<Restaurant> optional = restaurantRepository.findById(id);

        if (optional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Restaurant not found"));
        }

        Restaurant restaurant = optional.get();
        restaurant.setApproved(true);
        restaurantRepository.save(restaurant);

        firebaseSyncService.pushRestaurantToFirebase(restaurant);

        return ResponseEntity.ok(Map.of("message", "Restaurant Approved"));
    }

    @GetMapping("/counts")
    public ResponseEntity<?> getCounts() {
        long totalGuides = guideRepository.count();
        long totalRestaurants = restaurantRepository.count();
        long activeGuides = guideRepository.countByIsApprovedTrue();
        long activeRestaurants = restaurantRepository.countByIsApprovedTrue();
        long pendingGuides = guideRepository.countByIsApprovedFalse();
        long pendingRestaurants = restaurantRepository.countByIsApprovedFalse();

        return ResponseEntity.ok(Map.of(
                "totalGuides", totalGuides,
                "totalRestaurants", totalRestaurants,
                "activeGuides", activeGuides,
                "activeRestaurants", activeRestaurants,
                "pendingGuides", pendingGuides,
                "pendingRestaurants", pendingRestaurants
        ));
    }
}
