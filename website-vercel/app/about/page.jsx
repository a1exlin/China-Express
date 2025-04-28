import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">About Us</h1>
        <div className="mx-auto mb-4 h-1 w-20 bg-secondary"></div>
        <p className="mx-auto max-w-2xl text-gray-600">
          Learn more about China Express and our commitment to authentic Chinese cuisine.
        </p>
      </div>

      <div className="grid gap-12 md:grid-cols-2">
        <div>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">Our Story</h2>
          <p className="mb-4 text-gray-700">
            China Express was founded in 2005 by Chef Li Wei, who brought his family's traditional recipes from Sichuan
            Province to create an authentic Chinese dining experience.
          </p>
          <p className="mb-4 text-gray-700">
            What started as a small takeout restaurant has grown into a beloved establishment in the community, known
            for our commitment to quality ingredients and traditional cooking techniques.
          </p>
          <p className="text-gray-700">
            Our mission is to share the rich culinary heritage of China through carefully crafted dishes that balance
            authentic flavors with modern presentation, creating a memorable dining experience for all our customers.
          </p>
        </div>
        <div className="relative h-[300px] overflow-hidden rounded-lg md:h-auto">
          <Image src="/placeholder.svg?height=600&width=800" alt="Restaurant interior" fill className="object-cover" />
        </div>
      </div>

      <div className="mt-16">
        <h2 className="mb-8 text-center text-2xl font-semibold text-gray-900">Meet Our Team</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-4 h-40 w-40 overflow-hidden rounded-full">
              <div className="relative h-full w-full">
                <Image src="/placeholder.svg?height=160&width=160" alt="Chef Li Wei" fill className="object-cover" />
              </div>
            </div>
            <h3 className="mb-1 text-xl font-medium">Chef Li Wei</h3>
            <p className="mb-2 text-secondary">Founder & Head Chef</p>
            <p className="text-sm text-gray-600">
              With over 30 years of culinary experience, Chef Li brings authentic Sichuan flavors to every dish.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 h-40 w-40 overflow-hidden rounded-full">
              <div className="relative h-full w-full">
                <Image src="/placeholder.svg?height=160&width=160" alt="Sarah Chen" fill className="object-cover" />
              </div>
            </div>
            <h3 className="mb-1 text-xl font-medium">Sarah Chen</h3>
            <p className="mb-2 text-secondary">Restaurant Manager</p>
            <p className="text-sm text-gray-600">
              Sarah ensures that every customer has an exceptional dining experience from start to finish.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 h-40 w-40 overflow-hidden rounded-full">
              <div className="relative h-full w-full">
                <Image src="/placeholder.svg?height=160&width=160" alt="David Wong" fill className="object-cover" />
              </div>
            </div>
            <h3 className="mb-1 text-xl font-medium">David Wong</h3>
            <p className="mb-2 text-secondary">Sous Chef</p>
            <p className="text-sm text-gray-600">
              David specializes in dim sum and traditional Cantonese cuisine, adding variety to our menu.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16 bg-gray-50 p-8 rounded-lg">
        <h2 className="mb-6 text-center text-2xl font-semibold text-gray-900">Our Values</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-tertiary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 text-secondary"
              >
                <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
                <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                <path d="M12 2v2" />
                <path d="M12 22v-2" />
                <path d="m17 20.66-1-1.73" />
                <path d="M11 10.27 7 3.34" />
                <path d="m20.66 17-1.73-1" />
                <path d="m3.34 7 1.73 1" />
                <path d="M14 12h8" />
                <path d="M2 12h2" />
                <path d="m20.66 7-1.73 1" />
                <path d="m3.34 17 1.73-1" />
                <path d="m17 3.34-1 1.73" />
                <path d="m7 20.66 1-1.73" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-medium">Authenticity</h3>
            <p className="text-sm text-gray-600">
              We stay true to traditional recipes and cooking techniques to deliver authentic Chinese flavors.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-tertiary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 text-secondary"
              >
                <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-medium">Quality</h3>
            <p className="text-sm text-gray-600">
              We use only the freshest ingredients and never compromise on the quality of our food.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-tertiary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 text-secondary"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-medium">Community</h3>
            <p className="text-sm text-gray-600">
              We value our customers and strive to create a welcoming environment for everyone who visits us.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
