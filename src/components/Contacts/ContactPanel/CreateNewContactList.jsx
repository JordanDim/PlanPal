import { useContext } from "react";
import { Plus } from "../../../common/helpers/icons";
import { createContactList } from "../../../services/contacts.service";
import { useForm } from "react-hook-form";
import { AppContext } from "../../../context/AppContext";
import { MAX_TITLE_LENGTH } from "../../../common/constants";
import { themeChecker } from "../../../common/helpers/toast";

export default function CreateNewContactList() {
  const { userData } = useContext(AppContext);
  const { handleSubmit, register, reset } = useForm();

  const onSubmit = async (data) => {
    const { title } = data;
    if (title !== "" && title.length <= MAX_TITLE_LENGTH) {
      try {
        await createContactList(title, userData?.handle);
        themeChecker("Contact list created!");
        reset();
      } catch (error) {
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        className="input input-bordered h-min "
        placeholder="My Colleagues"
        type="text"
        {...register("title")}
      />
      <button type="submit">
        {" "}
        <Plus />
      </button>
    </form>
  );
}
