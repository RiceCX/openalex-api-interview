import * as React from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Legend,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from 'recharts';
import {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';
import { Author, Concept, WorkCounts } from '../lib/Author';
import AuthorContext from '../lib/AuthorContext';

const AuthorStatistics = () => {
  const { author }: { author: Author } = React.useContext(AuthorContext);

  if (!author) return;
  return (
    <div>
      <h1>{author.display_name}</h1>
      <a target={'_blank'} href={author.ids.openalex}>
        Open Alex
      </a>
      <div id="metadata">
        <div>
          <h1>Works</h1>
          <h3>Works Created: {author.works_count.toLocaleString()}</h3>
          <h3>Works Cited: {author.cited_by_count.toLocaleString()}</h3>
        </div>
        <div>
          <h1>Institution</h1>
          <h3>
            {author.last_known_institution.display_name},{' '}
            {author.last_known_institution.country_code}
          </h3>
        </div>
      </div>
      <div className="stat-section">
        <AuthorWorkStats work={author.counts_by_year} />
        <AuthorConceptsStats concepts={author.x_concepts} />
      </div>
    </div>
  );
};

const AuthorWorkStats = ({ work }: { work: WorkCounts[] }) => {
  return (
    <div>
      <h2>Work Count</h2>
      <AreaChart
        width={400}
        height={400}
        margin={{
          bottom: 20,
        }}
        data={work}
      >
        <XAxis dataKey="year" name="Years">
          <Label value="Year" offset={0} position="bottom" />
        </XAxis>
        <YAxis />

        <Tooltip />
        <CartesianGrid stroke="#f5f5f5" />
        <Area
          type="monotone"
          dataKey="cited_by_count"
          stroke="#387908"
          name="Cited Work"
        />
        <Area
          type="monotone"
          dataKey="works_count"
          stroke="#ff7300"
          name="Work Created"
        />
      </AreaChart>
    </div>
  );
};

const ConceptToolTip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{label}</p>
        <p className="score">Score - {payload[0].value}</p>
        <p className="desc">Level - {payload[0].payload.level}</p>
      </div>
    );
  }

  return null;
};
const AuthorConceptsStats = ({ concepts }: { concepts: Concept[] }) => {
  const [maxDataSize, setMaxDataSize] = React.useState(concepts.length);

  const handleDataSizeChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    let newSize = Number(evt.target.value);

    if (newSize > concepts.length) newSize = concepts.length;

    if (newSize <= 0) newSize = 1;
    setMaxDataSize(newSize);
  };

  return (
    <div id="conceptsstats">
      <div className="stat-header">
        <h2>Concepts</h2>
        <div>
          Max Concepts:{' '}
          <input
            type="number"
            max={concepts.length}
            min={0}
            defaultValue={concepts.length}
            onChange={handleDataSizeChange}
          />
        </div>
      </div>
      <BarChart
        width={800}
        height={400}
        margin={{
          top: 20,
          right: 80,
          bottom: 20,
          left: 20,
        }}
        data={concepts.slice(0, maxDataSize)}
      >
        <Tooltip content={<ConceptToolTip />} />
        <CartesianGrid stroke="#f5f5f5" />
        <Bar dataKey="score" fill="#8884d8" name="Score" />
        <XAxis dataKey="display_name" name="Concepts">
          <Label value="Concept Name" offset={20} position="bottom" />
        </XAxis>
        <YAxis>
          <Label value="Score" angle={-90} offset={0} position="insideLeft" />
        </YAxis>

        <Tooltip />
        <Legend />
      </BarChart>
    </div>
  );
};

export default AuthorStatistics;
