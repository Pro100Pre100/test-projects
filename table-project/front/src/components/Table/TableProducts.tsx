import './Table.css'
import { useEffect, useState } from "react";
import { getProducts } from "../../api/products";
import type { AlertOptionsProps, OptionsState, ProductsState } from "../../interface/main";
import InfiniteLoader from "react-window-infinite-loader";
import { FixedSizeList } from "react-window";
import { Row } from './Row';
import { Alert, Button } from '@mui/material';
import CreateModal from './CreateModal';

export default function TableProducts() {

  const [products, setProducts] = useState<ProductsState[]>([]);
  const [options, setOptions] = useState<OptionsState>({ maxValue: products.length + 1, hasMore: true, tableHead: [] });
  const [open, setOpen] = useState(false);
  const [alertOptions, setAlertOptions] = useState<AlertOptionsProps>({ alertType: 'error', text: '', isOpen: false });

  const alertHandleOpen = ({ alertType = 'error', text = 'Произошла ошибка' }: AlertOptionsProps) => {
    if (!alertOptions.isOpen) {
      setAlertOptions({ alertType: alertType, text: text, isOpen: true });
    }
  }

  const getNewProduct = () => {
    // setProducts((prev) => [...prev, product])
    setOptions((prev) => ({ ...prev, hasMore: true }))
  }

  useEffect(() => {
    if (alertOptions.isOpen) {
      setTimeout(() => {
        setAlertOptions((prev) => ({ ...prev, isOpen: false }))
      }, 2000)
    }
  }, [alertOptions.isOpen])

  //Сколько записей загружается за раз
  const productsPerScroll = 2;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  async function fetchProducts() {
    try {
      const res = await getProducts(products.length, products.length + productsPerScroll);

      if (res.data.length === 0) {
        setOptions((prev) => ({ ...prev, maxValue: products.length, hasMore: false }));
      }
      else {

        const newProducts = res.data;
        const uniqueKeys = new Set<string>();

        newProducts.forEach((product: ProductsState) => {
          Object.keys(product).forEach((key) => uniqueKeys.add(key));
        });
        options.tableHead.forEach((key) => uniqueKeys.add(key));

        setProducts((prev) => [...prev, ...res.data]);
        setOptions({
          maxValue: products.length,
          hasMore: true,
          tableHead: Array.from(uniqueKeys).slice(0, 15),
        });
      }

    }
    catch (err) {
      console.error(err);
      alertHandleOpen({ alertType: 'error', text: 'Не удалось загрузить таблицу' });
    }
  }

  const isItemLoaded = (index: number) => {
    return !!products[index];
  }

  return (
    <div className="tableProducts">
      {alertOptions.isOpen && <Alert severity={alertOptions.alertType} variant="filled" sx={{ position: 'absolute', top: 10, right: 10, zIndex: 1500 }}>{alertOptions.text}</Alert>}
      <CreateModal open={open} handleClose={handleClose} alertHandleOpen={alertHandleOpen} allHeads={options.tableHead} getNewProduct={getNewProduct} children />
      <h1>Таблица</h1>
      <section className="table">
        <div className="tableHead">
          {options.tableHead?.map((headField) =>
            <div key={headField} className="tableCell head">{headField}</div>)}
        </div>
        <div className="tableBody">
          <InfiniteLoader
            isItemLoaded={isItemLoaded}
            itemCount={options.hasMore ? products.length + 1 : options.maxValue}
            loadMoreItems={options.hasMore ? fetchProducts : () => { }}
          >
            {({ onItemsRendered, ref }) => (
              <FixedSizeList
                height={325}
                itemCount={options.hasMore ? products.length + 1 : options.maxValue}
                itemSize={75}
                onItemsRendered={onItemsRendered}
                ref={ref}
                style={{ overflowX: 'hidden' }}
                width={150 * options.tableHead.length + 20}

                itemData={products}
              >
                {({ index, style, data }) => (
                  <Row
                    index={index}
                    style={style}
                    data={data[index]}
                    isItemLoaded={isItemLoaded}
                    tableHead={options.tableHead}
                  />
                )}

              </FixedSizeList>
            )}
          </InfiniteLoader>
        </div>
      </section>
      <Button variant="outlined" onClick={handleOpen}>Добавить запись в таблицу</Button>
    </div>
  )
}