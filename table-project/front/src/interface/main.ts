import type { HTMLAttributes, ReactNode } from "react";
import type { CSSProperties } from "styled-components";

export interface ProductsState {
  id: number,
  title: string,
  createdAt: string,
  status: string,
  author: string,
  description: string,
  version: string,
  [key: string]: number | string;
}

export interface CreateModalProps {
  open: boolean;
  handleClose: () => void;
  alertHandleOpen: ({ alertType, text }: AlertOptionsProps) => void;
  children: ReactNode;
  getNewProduct: () => void;
  allHeads: string[];
}

export interface ModalProps {
  open: boolean;
  handleClose: () => void;
  children: ReactNode;
}

export interface IconWrapperProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface RowProps {
  index: number;
  style: CSSProperties;
  data: ProductsState;
  isItemLoaded: (index: number) => Boolean;
  tableHead: string[];
}
export interface OptionsState {
  maxValue: number;
  hasMore: boolean;
  tableHead: string[];
}

export interface FormState {
  [key: string]: string;
}

export interface newFieldState {
  isNewField: boolean;
  head: string;
}

export interface CurrentHeadState {
  serverHeads: string[];
  newHeads: string[];
}

export interface AlertOptionsProps {
  alertType: 'error' | 'warning' | 'info' | 'success';
  text: string;
  isOpen?: boolean;
}