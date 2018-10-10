import { h, Component } from 'preact';
export interface ButtonProps {
  label: string;
  onClick: ()=>void;
  id?: string;
}

export default function Button({id, onClick, label}: ButtonProps) {
  return <button id={id} onClick={onClick}>{label}</button>;
}