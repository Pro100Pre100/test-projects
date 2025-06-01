import { useEffect, useState, type ChangeEvent, type MouseEvent } from "react";
import type { CreateModalProps, CurrentHeadState, FormState, newFieldState } from "../../interface/main";
import ModalUI from "../UI/ModalUI/ModalUI";
import { CircularProgress, TextField } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import IconWrapper from "../UI/IconWrapper/IconWrapper";
import { createProducts } from "../../api/products";

//По логике данной страницы, можно добавить еще один столбец, даже если их количество больше 15 (в случае, если не успели прогрузиться остальные заголовки)

export default function CreateModal({ open, handleClose, alertHandleOpen, allHeads, getNewProduct }: CreateModalProps) {

  //Здесь считаем, сколько всего заголовков добавит пользователь + сколько всего на сервере, чтобы не уйти в лимит
  const [currentHead, setCurrentHead] = useState<CurrentHeadState>({ serverHeads: [], newHeads: [] });

  const [field, setField] = useState<newFieldState>({ isNewField: false, head: '' })
  const [form, setForm] = useState<FormState>({});
  const [isLoadingModal, setIsLoadingModal] = useState<boolean>(true);
  const [isLoadingFetch, setIsLoadingFetch] = useState<boolean>(false);

  useEffect(() => {
    const getHeadFields = async () => {
      try {

        const objForm: FormState = {};
        allHeads.forEach((key: string) => {
          objForm[key] = '';
        })

        setCurrentHead((prev) => ({ ...prev, serverHeads: allHeads.map((head) => head.toLowerCase()) }));
        setForm(objForm);
        setIsLoadingModal(false);
      }
      catch (err) {
        console.error(err);
        setIsLoadingModal(false);
        alertHandleOpen({ alertType: 'error', text: 'Не удалось загрузить список заголовков' });
        handleClose();
      }

    }

    getHeadFields();

    return function () {
      setField({ isNewField: false, head: '' });
      setForm({});
      setCurrentHead({ serverHeads: [], newHeads: [] });
      setIsLoadingModal(true);
      setIsLoadingFetch(false);
    }

  }, [open])

  const deleteHead = (headField: string) => () => {

    const lowerHeadFields = headField.toLowerCase();

    if (currentHead.newHeads.includes(lowerHeadFields)) {
      const remainNewHeads = [...currentHead.newHeads].filter((newHead) => newHead !== lowerHeadFields);
      setCurrentHead((prev) => ({ ...prev, newHeads: remainNewHeads }));
    }

    const newObj: FormState = { ...form };
    delete newObj[headField];
    setForm(newObj);

  }

  const addFieldHandler = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (15 - currentHead.serverHeads.length - currentHead.newHeads.length <= 0) {
      alertHandleOpen({ alertType: 'error', text: 'Максимальное количество столбцов - 15' });
      return
    }

    if (!field.isNewField) {
      setField((prev) => ({ ...prev, isNewField: true }))
    }
  }

  const addNewHead = () => {

    if (field.head.length > 20 || field.head.length <= 1) {
      alertHandleOpen({ alertType: 'error', text: 'заголовок не может быть меньше 2 и больше 15 символов' });
      return
    }

    const lowerfieldHead = field.head.toLowerCase();

    //Здесь мы создаем уникальную коллекцию из только что добавленных заголовков + из заголовков, которые есть в данный момент на доске
    //Это нужно для того, чтобы при удалении пользователем серверного заголовка, он мог добавить его снова
    const setCollectionHeads = new Set([...currentHead.newHeads, ...Object.keys(form)]);
    const lowerCaseArr = Array.from(setCollectionHeads).map((head) => head.toLowerCase());
    const isUnique = !lowerCaseArr.includes(lowerfieldHead);

    if (!isUnique) {
      alertHandleOpen({ alertType: 'error', text: 'Данный заголовок уже есть в списке' });
      return
    }

    if (!currentHead.serverHeads.includes(lowerfieldHead)) {
      setCurrentHead((prev) => ({ ...prev, newHeads: [...prev.newHeads, lowerfieldHead] }));
    }
    setForm((prev) => ({ ...prev, [field.head]: '' }));
    setField({ isNewField: false, head: '' });
  }

  const deleteNewHead = () => {
    setField({ isNewField: false, head: '' });
  }

  const changeField = (headField: string, text: string) => {
    setForm((prev) => ({ ...prev, [headField]: text }))
  }

  const sendToServer = async (event: MouseEvent<HTMLButtonElement>) => {
    const emptyObj = Object.keys(form).filter((key) => form[key].length === 0);
    console.log(emptyObj);
    event.preventDefault();
    if (!emptyObj.length) {
      await createProducts(form);
      setIsLoadingFetch(true);
      getNewProduct();
      handleClose();
      alertHandleOpen({ alertType: 'success', text: 'Успешно загружено!' });
    }
    else {
      alertHandleOpen({ alertType: 'error', text: 'Поля не могут быть пустыми' });
    }
  }

  return (
    <ModalUI open={open} handleClose={handleClose}>
      {isLoadingModal
        ? <CircularProgress />
        : <div className="createModal">
          <h2>Создать новую запись</h2>
          <form className="createModal__form">
            <div className="createModal__headArea">
              {Object.keys(form).map((headField) =>
                <div className="oneColumn" key={headField}>
                  <span className="oneColumn__fieldWrapper" onClick={deleteHead(headField)}>{headField}</span>
                  <TextField label="Запись" variant="standard" onChange={(event: ChangeEvent<HTMLInputElement>) => changeField(headField, event.target.value)} />
                </div>
              )}
            </div>
            {field.isNewField && <div className="newFieldWrapper">
              <input
                className="newField"
                placeholder="Пусто"
                onChange={(event: ChangeEvent<HTMLInputElement>) => setField((prev) => ({ ...prev, head: event.target.value }))}
              />
              <IconWrapper onClick={addNewHead}> <AddCircleOutlineOutlinedIcon /> </IconWrapper>
              <IconWrapper onClick={deleteNewHead}> <DeleteIcon /> </IconWrapper>
            </div>}
            <button className="createModal__addField" onClick={addFieldHandler}>Добавить поле</button>
            <button className="createModal__submitForm" onClick={sendToServer}>{!isLoadingFetch ? 'Отправить' : <CircularProgress />}</button>
          </form>
          <div className="createModal__remainFields">Осталось полей: {15 - currentHead.serverHeads.length - currentHead.newHeads.length}</div>
        </div>
      }
    </ModalUI>
  )
}
