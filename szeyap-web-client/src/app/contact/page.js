// Make sure to run npm install @formspree/react
// For more help visit https://formspr.ee/react-help
"use client";

import Header from '../../components/Header';
import SocialSidebar from '../../components/SocialSidebar';
import Footer from '../../components/Footer';
import { useForm } from "@formspree/react";

export default function Contact() {
  const [state, handleSubmit] = useForm("xwpgqaza");

  if (state.succeeded) {
    return (
        <div className="min-h-screen flex flex-col">
             <Header />
          <SocialSidebar />
          <main className="pt-32 flex-grow">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          {/* Main Logo */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <img
              src="/hoisan_sauce_logo.webp"
              alt="台山醬 Hoisan Sauce Logo"
              className="h-24 sm:h-32 md:h-36 lg:h-40 object-contain mx-auto mb-4 sm:mb-6"
            />
          </div>
        <div className="text-center mb-8">
            <span className="text-2xl">Thanks for your feedback!</span>
        </div>

        </div>
         </main>
          <Footer />
         </div>
    );
  }

  return (
     <div className="min-h-screen flex flex-col">
          <Header />
          <SocialSidebar />
          <main className="pt-32 flex-grow">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          {/* Main Logo */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <img
              src="/hoisan_sauce_logo.webp"
              alt="台山醬 Hoisan Sauce Logo"
              className="h-24 sm:h-32 md:h-36 lg:h-40 object-contain mx-auto mb-4 sm:mb-6"
            />
          </div>
    
    <div className="text-center mb-8">
        <span className="text-2xl font-medium">Suggestions? 有意見？</span>
    </div>
    
    <form className="grid gap-y-9" onSubmit={handleSubmit}>
      <div className="max-w-full mx-auto text-left">
        <label
          className="block font-normal text-sm font-medium text-[--color-text-default]"
          htmlFor="name"
        >
          Name
        </label>
        <input
          className="h-10 w-100 appearance-none rounded-md border-1 px-3 text-[--color-text-default] outline-none ring-1 ring-inset ring-[--color-border-default] placeholder:text-[--color-text-muted] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-0 focus-visible:outline-[--color-highlight] focus-visible:ring-[1.5px] focus-visible:ring-inset focus-visible:ring-[--color-border-active]"
          id="name"
          name="name"
        />
      </div>
      <div className="max-w-full mx-auto text-left">
        <label
          className="block font-normal text-sm font-medium text-[--color-text-default]"
          htmlFor="email"
        >
          Email
        </label>
        <input
          className="h-10 w-100 font-normal appearance-none rounded-md border-1 px-3 text-[--color-text-default] outline-none ring-1 ring-inset ring-[--color-border-default] placeholder:text-[--color-text-muted] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-0 focus-visible:outline-[--color-highlight] focus-visible:ring-[1.5px] focus-visible:ring-inset focus-visible:ring-[--color-border-active]"
          id="email"
          name="email"
          required
        />
      </div>
      <div className="max-w-full mx-auto text-left">
        <label
          className="block font-normal text-sm font-medium text-[--color-text-default]"
          htmlFor="message"
        >
          Message
        </label>
        <textarea
          className="h-50 w-100 appearance-none rounded-md border-1 px-3 py-2 text-[--color-text-default] outline-none ring-1 ring-inset ring-[--color-border-default] placeholder:text-[--color-text-muted] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-0 focus-visible:outline-[--color-highlight] focus-visible:ring-[1.5px] focus-visible:ring-inset focus-visible:ring-[--color-border-active]"
          id="message"
          name="message"
        ></textarea>
        <p className="block text-sm text-[--color-text-muted]">
        </p>
      </div>
      <div className="max-w-full mx-auto text-left mb-8">
        <button className="px-4 py-2 bg-gray-100 text-gray-900 font-normal rounded-md hover:bg-gray-200 transition-color cursor-pointer flex items-center" type="submit">
          Send
        </button>
      </div>
    </form>
   
    </div>
    </main>
     <Footer />
    </div>
  );

}
