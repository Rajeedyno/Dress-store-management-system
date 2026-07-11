# How the Recommendation System Works

1. A customer uploads a photo through the recommendation page.
2. The backend stores the image metadata and creates a simple feature profile.
3. The heuristic recommendation engine assigns scores to dresses based on category fit and color/body-shape preferences.
4. The top five dresses are returned with confidence scores and saved in the recommendations table.
5. The frontend displays the recommended dresses for the customer to browse.

This demo uses a rule-based approach for simplicity and reliability. It can be upgraded later to a real computer vision model such as ResNet or MobileNet with transfer learning.
