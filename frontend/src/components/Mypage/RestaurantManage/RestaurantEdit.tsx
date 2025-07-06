import useMypageStore from "../../../stores/mypageStore";
import RestaurantRegisterEdit from "./RestaurantRegisterEdit";

const RestaurantEdit = () => {
  const { restaurantEditId } = useMypageStore();
  return (
    <RestaurantRegisterEdit key={`create${restaurantEditId}`} mode="edit" />
  );
};

export default RestaurantEdit;
