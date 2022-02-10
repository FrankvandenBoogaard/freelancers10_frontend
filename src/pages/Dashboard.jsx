import { gql, useQuery } from '@apollo/client';
import { UserIcon, CurrencyEuroIcon } from '@heroicons/react/outline';
import {
  ArrowNarrowLeftIcon,
  ArrowNarrowRightIcon,
  ChevronRightIcon,
  RefreshIcon,
  SearchIcon,
} from '@heroicons/react/solid';

import { Link } from 'react-router-dom';
import { LoadingDirectory } from '../common/Loading';
const tabs = [
  { name: 'Active tasks', href: '#', count: '2', current: true },
  { name: 'Applications', href: '#', count: '4', current: false },
  // { name: 'Interview', href: '#', count: '6', current: false },
  // { name: 'Offer', href: '#', current: false },
  // { name: 'Disqualified', href: '#', current: false },
];

/* This example requires Tailwind CSS v2.0+ */

const DASHBOARD = gql`
  query Query($sort: [String], $pagination: PaginationArg) {
    tasks(sort: $sort, pagination: $pagination) {
      data {
        id
        attributes {
          taskName
          taskStart
          taskFinish
          taskPurchase
          taskSale
          project {
            data {
              attributes {
                projectName
                projectStart
                customer {
                  data {
                    attributes {
                      customerName
                    }
                  }
                }
              }
            }
          }
          freelancer {
            data {
              id
              attributes {
                firstName
                lastName
                competence
                imageUrl
                phoneNumber
              }
            }
          }
        }
      }
    }
  }
`;

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Dashboard() {
  const {
    loading,
    error,
    data,
    refetch: refetchDirectory,
  } = useQuery(DASHBOARD, {
    variables: {
      sort: 'taskFinish',
      pagination: { pageSize: 1000 },
      // filters: {
      //   availableFrom: {
      //     lte: '2022-01-21T00:00:00.000Z',
      //   },
      // },
    },
    pollInterval: 2000,
  });

  if (loading) return <LoadingDirectory />;
  if (error) return `Error! ${error}`;

  return (
    <main className='w-full mx-auto px-3 pb-6 lg:px-8 flex flex-col'>
      <div className='flex flex-col border-b border-gray-200 items-center pt-6 pb-4'>
        <h2 className='text-2xl font-medium text-gray-900'>Digital-tribes</h2>
        {/* Tabs */}
        <div className='sm:hidden w-full'>
          <label htmlFor='tabs' className='sr-only'>
            Select a tab
          </label>
          {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
          <select
            id='tabs'
            name='tabs'
            className='mt-4 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md'
            defaultValue={tabs.find((tab) => tab.current).name}
          >
            {tabs.map((tab) => (
              <option key={tab.name}>{tab.name}</option>
            ))}
          </select>
        </div>

        <div className='hidden sm:block w-full'>
          <div className='border-b border-gray-200'>
            <nav className='mt-6 -mb-px flex space-x-8' aria-label='Tabs'>
              {tabs.map((tab) => (
                <a
                  key={tab.name}
                  href={tab.href}
                  className={classNames(
                    tab.current
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200',
                    'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                  )}
                >
                  {tab.name}
                  {tab.count ? (
                    <span
                      className={classNames(
                        tab.current
                          ? 'bg-purple-100 text-purple-600'
                          : 'bg-gray-100 text-gray-900',
                        'hidden ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block'
                      )}
                    >
                      {tab.count}
                    </span>
                  ) : null}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <p className='mt-1 text-sm text-gray-600'>
          {/* Search directory of {data?.freelancers.data.length} freelancer
          {data?.freelancers.data.length !== 1 && 's'} */}
        </p>
        <form
          className='w-full mt-6 flex justify-center space-x-4'
          //onSubmit={handleSubmit(onSubmit)}
          //onKeyDown={(key) => checkKeyDown(key)}
        >
          <div className='max-w-lg flex-1 min-w-0'>
            <label htmlFor='search' className='sr-only'>
              Search
            </label>
            <div className='relative rounded-md shadow-sm'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <SearchIcon
                  className='h-5 w-5 text-gray-400'
                  aria-hidden='true'
                />
              </div>
              <input
                type='text'
                autoComplete='off'
                //{...register('search')}
                className='focus:ring-indigo-500 focus:border-indigo-500 block pl-10 sm:text-sm border-gray-300 rounded-md w-full'
                placeholder='Task name'
              />
            </div>
          </div>
          <button
            type='submit'
            // onClick={() => {
            //   navigate('/freelancers/add');
            // }}
            className='inline-flex justify-center px-3.5 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          >
            <RefreshIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
            <span className='sr-only'>Search</span>
          </button>
        </form>
      </div>
      <div className='w-full mx-auto pt-0 flex flex-col overflow-y-auto overflow-x-hidden'>
        <div className='-my-2 sm:-mx-6 lg:-mx-8'>
          <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
            <div className='overflow-hidden sm:rounded-lg'>
              {/* Stacked list */}
              <ul className='border-gray-200 divide-y divide-gray-200'>
                {data.tasks.data.map((task) => (
                  <li key={task.id}>
                    <Link to={`/tasks/${task.id}`} className='group block hover:bg-gray-50'>
                      <div className='flex items-center py-5 px-4 sm:py-6 sm:px-0'>
                        <div className='min-w-0 flex-1 flex items-center'>
                          {/* <div className='flex-shrink-0'>
                            <img
                              className='h-12 w-12 rounded-full group-hover:opacity-75'
                              src={
                                task.attributes.freelancer.data.attributes
                                  .imageUrl
                              }
                              alt=''
                            />
                          </div> */}
                          <div className='min-w-0 flex-1 px-4 md:grid md:grid-cols-6 md:gap-4'>
                            <div>
                              <p className='text-sm text-gray-900 truncate'>
                                {task.attributes.taskName}
                                {/* <time dateTime={candidate.appliedDatetime}>
                                    {candidate.applied}
                                  </time> */}
                              </p>
                              <p className='mt-2 flex items-center text-sm text-gray-500'>
                                {/* <CheckCircleIcon
                                  className='flex-shrink-0 mr-1.5 h-5 w-5 text-green-400'
                                  aria-hidden='true'
                                /> */}
                                {
                                  task.attributes.project.data.attributes
                                    .customer.data.attributes.customerName
                                }
                              </p>
                            </div>

                            <div className='hidden md:block'>
                              <div>
                                <p className='text-sm font-medium truncate'>
                                  {
                                    task.attributes.freelancer.data.attributes
                                      .lastName
                                  }
                                  ,{' '}
                                  {
                                    task.attributes.freelancer.data.attributes
                                      .firstName
                                  }
                                </p>
                                <p className='mt-2 flex items-center text-sm text-gray-500'>
                                  {/* <MailIcon
                                    className='flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400'
                                    aria-hidden='true'
                                  /> */}
                                  <span className='truncate'>
                                    {
                                      task.attributes.freelancer.data.attributes
                                        .competence
                                    }
                                  </span>
                                </p>
                              </div>
                            </div>
                            <div className='hidden md:block'>
                              <div>
                                <p className='text-sm text-gray-900'>
                                  purchase{' '}
                                  {/* <time dateTime={candidate.appliedDatetime}>
                                    {candidate.applied}
                                  </time> */}
                                </p>
                                <p className='mt-2 flex items-center text-sm text-gray-500'>
                                  <CurrencyEuroIcon
                                    className='flex-shrink-0 mr-1.5 h-5 w-5 '
                                    aria-hidden='true'
                                  />
                                  {task.attributes.taskPurchase}
                                </p>
                              </div>
                            </div>
                            <div className='hidden md:block'>
                              <div>
                                <p className='text-sm text-gray-900'>
                                  sale{' '}
                                  {/* <time dateTime={candidate.appliedDatetime}>
                                    {candidate.applied}
                                  </time> */}
                                </p>
                                <p className='mt-2 flex items-center text-sm text-gray-500'>
                                  <CurrencyEuroIcon
                                    className='flex-shrink-0 mr-1.5 h-5 w-5'
                                    aria-hidden='true'
                                  />
                                  {task.attributes.taskSale}
                                </p>
                              </div>
                            </div>
                            <div className='hidden md:block'>
                              <div>
                                <p className='text-sm text-gray-900'>
                                  profit{' '}
                                  {/* <time dateTime={candidate.appliedDatetime}>
                                    {candidate.applied}
                                  </time> */}
                                </p>
                                <p className='mt-2 flex items-center text-sm text-gray-500'>
                                  <CurrencyEuroIcon
                                    className='flex-shrink-0 mr-1.5 h-5 w-5 text-green-400'
                                    aria-hidden='true'
                                  />
                                  {task.attributes.taskSale-task.attributes.taskPurchase}
                                </p>
                              </div>
                            </div>
                            <div className='hidden md:block'>
                              <div>
                                <p className='text-sm text-gray-900'>
                                  finish{' '}
                                  {/* <time dateTime={candidate.appliedDatetime}>
                                    {candidate.applied}
                                  </time> */}
                                </p>
                                <p className='mt-2 flex items-center text-sm text-gray-500'>
                                  {/* <CheckCircleIcon
                                    className='flex-shrink-0 mr-1.5 h-5 w-5 text-green-400'
                                    aria-hidden='true'
                                  /> */}
                                  {new Date(
                                    task.attributes.taskFinish
                                  ).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <ChevronRightIcon
                            className='h-5 w-5 text-gray-400 group-hover:text-gray-700'
                            aria-hidden='true'
                          />
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* Pagination */}
      <nav
        className='border-t border-gray-200 px-4 flex items-center justify-between sm:px-0'
        aria-label='Pagination'
      >
        <div className='-mt-px w-0 flex-1 flex'>
          <a
            href='#'
            className='border-t-2 border-transparent pt-4 pr-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-200'
          >
            <ArrowNarrowLeftIcon
              className='mr-3 h-5 w-5 text-gray-400'
              aria-hidden='true'
            />
            Previous
          </a>
        </div>
        <div className='hidden md:-mt-px md:flex'>
          <a
            href='#'
            className='border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium'
          >
            1
          </a>
          {/* Current: "border-purple-500 text-purple-600", Default: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200" */}
          <a
            href='#'
            className='border-purple-500 text-purple-600 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium'
            aria-current='page'
          >
            2
          </a>
          <a
            href='#'
            className='border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium'
          >
            3
          </a>
          <a
            href='#'
            className='border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium'
          >
            4
          </a>
          <a
            href='#'
            className='border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium'
          >
            5
          </a>
          <a
            href='#'
            className='border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium'
          >
            6
          </a>
        </div>
        <div className='-mt-px w-0 flex-1 flex justify-end'>
          <a
            href='#'
            className='border-t-2 border-transparent pt-4 pl-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-200'
          >
            Next
            <ArrowNarrowRightIcon
              className='ml-3 h-5 w-5 text-gray-400'
              aria-hidden='true'
            />
          </a>
        </div>
      </nav>
    </main>
  );
}
