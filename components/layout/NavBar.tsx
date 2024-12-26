'use client';

import { useAuth, UserButton } from '@clerk/nextjs';
import Container from '../Container';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import SearchInput from '../SearchInput';
import { ModeToggle } from '../theme-toggle';
import { NavMenu } from './NavMenu';
import { useState } from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Link from 'next/link';
import { Menu } from 'lucide-react';

const navItems = [
  {
    title: 'Trang chủ',
    href: '/',
  },
  {
    title: 'Khách sạn',
    href: '/hotels',
  },
  {
    title: 'Về chúng tôi',
    href: '/about',
  },
  {
    title: 'Tin tức',
    href: '/news',
  },
];
const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { userId } = useAuth();
  return (
    <div
      className="sticky top-0 border border-b-primary/10 
  bg-secondary z-50"
    >
      <Container>
        <div className="flex justify-between items-center">
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => router.push('/')}
          >
            <Image src={'/logo.svg'} alt="logo" width="75" height="75" />
            <div className="font-bold text-xl">Kinyias Hotel</div>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList>
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.title}>
                    <Link href={item.href} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        {item.title}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col justify-between h-full">
                  <nav className="flex flex-col gap-4">
                    {navItems.map((item) => (
                      <div key={item.title}>
                        <Link
                          href={item.href}
                          className="py-2 text-lg font-semibold"
                          onClick={() => setIsOpen(false)}
                        >
                          {item.title}
                        </Link>
                      </div>
                    ))}
                  </nav>
                  <div className="flex justify-between">
                    <div>
                      <ModeToggle />
                      <NavMenu />
                    </div>
                    <UserButton />
                    {!userId && (
                      <>
                        <Button
                          onClick={() => router.push('/sign-in')}
                          variant="outline"
                          size="sm"
                        >
                          Sign in
                        </Button>
                        <Button
                          onClick={() => router.push('/sign-up')}
                          size="sm"
                        >
                          Sign up
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <div className="flex gap-3 items-center hidden md:flex">
            <div>
              <ModeToggle />
              <NavMenu />
            </div>
            <UserButton />
            {!userId && (
              <>
                <Button
                  onClick={() => router.push('/sign-in')}
                  variant="outline"
                  size="sm"
                >
                  Sign in
                </Button>
                <Button onClick={() => router.push('/sign-up')} size="sm">
                  Sign up
                </Button>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default NavBar;
