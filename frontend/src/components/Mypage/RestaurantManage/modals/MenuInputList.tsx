import classNames from "classnames";
import type { menu } from "../../../../types/menu";
import ErrorMessage from "./ErrorMessage";

interface MenuInputListProps {
  menus: menu[];
  setMenus: (menus: menu[]) => void;
  error?: string;
}

const MenuInputList = ({ menus, setMenus, error }: MenuInputListProps) => {
  const handleMenuNameChange = (idx: number, name: string) => {
    setMenus(
      menus.map((m, i) => (i === idx ? { name: name, price: m.price } : m))
    );
  };
  const handleMenuPriceChange = (idx: number, price: string) => {
    setMenus(
      menus.map((m, i) => (i === idx ? { name: m.name, price: price } : m))
    );
  };
  const addMenu = () => setMenus([...menus, { name: "", price: "" }]);
  const removeMenu = (idx: number) =>
    setMenus(menus.filter((_, i) => i !== idx));

  return (
    <div>
      <label className="block mb-1 font-semibold text-gray-700">
        메뉴 <span className="text-red-500">*</span>
      </label>
      <div className="space-y-2">
        {menus.map((menu, idx) => (
          <div key={idx} className="flex gap-2">
            <input
              className={classNames(
                "border rounded px-3 py-2",
                menus.length > 1 ? "w-[60%]" : "w-[65%]"
              )}
              placeholder={`메뉴 ${idx + 1}`}
              value={menu.name}
              onChange={(e) => handleMenuNameChange(idx, e.target.value)}
            />
            <input
              className={classNames(
                "border rounded px-3 py-2",
                menus.length > 1 ? "w-[27%]" : "w-[35%]"
              )}
              placeholder={`가격`}
              value={menu.price}
              onChange={(e) => handleMenuPriceChange(idx, e.target.value)}
            />
            {menus.length > 1 && (
              <button
                type="button"
                onClick={() => removeMenu(idx)}
                className="px-2 text-red-500"
              >
                삭제
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addMenu}
          className="mt-1 text-primary5 text-sm"
        >
          + 메뉴 추가
        </button>
      </div>
      <ErrorMessage message={error} />
    </div>
  );
};

export default MenuInputList;
