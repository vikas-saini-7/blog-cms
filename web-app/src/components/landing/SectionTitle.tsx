import React from "react";

interface SectionTitleProps {
  title: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title }) => {
  return (
    <div>
      <h1 className="font-heading border-orange-500 font-bold text-2xl pl-4 border-l-4 mb-8 py-2">
        {title}
      </h1>
    </div>
  );
};

export default SectionTitle;
