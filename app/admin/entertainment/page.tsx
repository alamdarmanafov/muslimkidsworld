import { VenueSection } from "../../../components/admin/VenueSection";
import { entertainmentVenues } from "../../../lib/adminMock";

export default function AdminEntertainment() {
  return (
    <VenueSection
      title="Əyləncə yerləri"
      subtitle="Kupon tərəfdaşı əyləncə məkanlarını idarə edin."
      initialVenues={entertainmentVenues}
      category="Əyləncə mərkəzi"
    />
  );
}
