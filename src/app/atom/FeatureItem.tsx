import React from 'react';
import { Link, LinkProps } from 'react-router-dom';

type FeatureItemProps = {
  title: React.ReactNode;
  description: React.ReactNode;
};

const FeatureItem: React.FC<FeatureItemProps & LinkProps> = ({
  title,
  description,
  ...props
}) => {
  return (
    <Link
      {...props}
      className="h-64 bg-blue-700 rounded-lg p-6 bg-opacity-25 hover:bg-opacity-30 transition duration-300"
    >
      <h2>{title}</h2>
      <p className="opacity-75 text-sm">{description}</p>
    </Link>
  );
};

export default FeatureItem;
