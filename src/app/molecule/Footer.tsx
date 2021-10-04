import React from 'react';
import socialLinks from 'config/socialLinks';
import { ReactComponent as MailIcon } from 'assets/icons/social_mail.svg';
import { ReactComponent as DiscordIcon } from 'assets/icons/social_discord.svg';
// import { ReactComponent as TelegramIcon } from 'assets/icons/social_telegram.svg';
import { ReactComponent as TwitterIcon } from 'assets/icons/social_twitter.svg';
import { ReactComponent as GithubIcon } from 'assets/icons/social_github.svg';
import SocialLink from '../atom/SocialLink';

export default function Footer() {
  return (
    <footer className='mt-12 flex-grow-0 flex-shrink-0'>
      <div className='container py-5'>
        <nav className='text-white flex space-x-4 justify-end items-center'>
          <SocialLink href={`mailto: ${socialLinks.email}`} icon={MailIcon} />
          <SocialLink href={socialLinks.twitterUrl} icon={TwitterIcon} />
          {/*<SocialLink href={socialLinks.telegramInvite} icon={TelegramIcon} />*/}
          <SocialLink href={socialLinks.discordInvite} icon={DiscordIcon} />
          <SocialLink href={socialLinks.githubRepository} icon={GithubIcon} />
        </nav>
      </div>
      <div className='container py-5 border-t border-blue-500 border-opacity-25'>
        <div className='flex space-x-8 justify-center items-center'>
          <span className='text-xs opacity-50'>
            &copy; 2021 Defray Labs. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
