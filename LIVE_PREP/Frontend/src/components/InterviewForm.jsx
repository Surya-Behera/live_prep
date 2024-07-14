
import React from 'react';

const InterviewForm = ({ formData, onChange, onSubmit }) => {
  return (
    <div>
    <h2 className="text-xl font-serif font-bold text-center text-gray-800 mb-3">Interview Room Setup</h2>
    <form onSubmit={onSubmit}className=" bg-white py-3 px-2 w-[320px] md:w-auto">
      <div>
        <label htmlFor="name" className="block font-sans font-semibold gray-700 text-lg space-y-5">Name</label>
        <input
          type="text"
          name="name"
          placeholder='Enter your name'
          id="name"
          value={formData.name}
          onChange={onChange}
          required
          className="mt-1 block w-full rounded-md focus:outline-none border border-black px-1"
        />
      </div>
      <div>
        <label htmlFor="subject" className="block font-sans font-semibold gray-700 text-lg space-y-5">Subject</label>
        <select
        
          name="subject"
          id="subject"
          value={formData.subject}
          onChange={onChange}
          required
          className="mt-1 block w-full rounded-md focus:outline-none border border-black px-2 mb-3"
        >
        <option value=" ">Select subject</option>
          <option value="React">React</option>
          <option value="Java">Java</option>
          <option value="Python<">Python</option>
          <option value="SQL">SQL</option>

        </select>
      </div>
      <label htmlFor="subject" className="block font-sans font-semibold gray-700 text-lg space-y-5">Difficulty Level</label>

     <div className="flex space-x-4">

  {['easy', 'medium', 'hard'].map((difficultyLevel) => (
    <label key={difficultyLevel} className="flex items-center">
      <input
        type="radio"
        name="difficultyLevel"
        value={difficultyLevel}
        checked={formData.difficultyLevel === difficultyLevel}
        onChange={onChange}
        className="mr-2"
        required
      />
      <span className="capitalize">{difficultyLevel}</span>
    </label>
  ))}
</div>

      <div>
        <label htmlFor="experience" className="block font-sans font-semibold gray-700 text-lg space-y-5">Years of Experience</label>
        <input
          type="number"
          name="experience"
          id="experience"
          value={formData.experience}
          onChange={onChange}
          required
          min="0"
          className="mt-1 block w-full rounded-md focus:outline-none border border-black px-2 mb-3"
        />
      </div>
    <div className='w-full flex items-center justify-center'>
    <button type="submit" className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 focus:outline-none  focus:ring-green-500 items-center">
        Start inteview
      </button>

    </div>
    </form>
    </div>
  );
};

export default InterviewForm;