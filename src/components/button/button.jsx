import React, { useState } from "react";
import "./button.css";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { useTranslation } from "react-i18next";


export const Button = ({ text = "LEARN MORE", type }) => {
  const [t, i18n] = useTranslation("global");
  return (
    <button className="clase-base flex justify-center items-center primary tracking-wider">
      {" "}
      <p>{t(text)}</p> <MdKeyboardDoubleArrowRight />
    </button>
  );
};
export const Button2 = ({ text }) => {
  const [t, i18n] = useTranslation("global");
  return (
    <button className="clase-base secondary flex justify-center items-cente ">
      <p className="p-2">{t(text)}</p><MdKeyboardDoubleArrowRight />
    </button>
  );
};

export const FormButton = ({ text, onClick }) => {
  const [t, i18n] = useTranslation("global");
  const [move, setMove] = useState(false);

  const handleClick = () => {
    setMove(prevMove => !prevMove);
    onClick(); 
  };
  return (
    <button
      className={`flex flex-col items-start mt-8 sm:space-x-4 sm:flex-row sm:items-center lg:mt-12 clase-base secondary flex justify-center items-center ${move ? "move-right" : "move-left"}`}
      onClick={handleClick}>
      <p className="p-2">{t(text)}</p>
      <MdKeyboardDoubleArrowRight />
    </button>
  );
};
