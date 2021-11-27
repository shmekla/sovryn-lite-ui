import React from 'react';

type SocialLinkProps = {
  href: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
};

const SocialLink: React.FC<SocialLinkProps> = ({ href, icon: Icon }) => {
  return (
    <a href={href} target="_blank" rel="noreferrer nofollow">
      <Icon className="fill-current hover:opacity-75 transition duration-300" />
    </a>
  );
};

export default SocialLink;
