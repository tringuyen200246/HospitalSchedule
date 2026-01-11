import DoctorsPage from "@/common/pages/DoctorsPage";
import DoctorsLayout from "@/common/layouts/DoctorsLayout";

export default function GuestDoctorsPage({
  searchParams,
}: {
  searchParams: {
    specialties?: string;
    academicTitles?: string;
    degrees?: string;
    sortBy?: string;
    searchValues?: string;
    displayView?: string;
  };
}) {
return (
    <DoctorsLayout basePath="/guest">
      <DoctorsPage
        isGuest={true} 
        basePath="/guest" 
        searchParams={searchParams}
      />
    </DoctorsLayout>
);} 