import React from "react";
import {
  Bar,
  BarChart,
  Legend,
  Pie,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { SimResults } from "../DataType";
import DPSOverTime from "./DPSOverTime";
import ParticlesCount from "./ParticlesCount";
import ReactionsTriggered from "./ReactionsTriggered";

export const COLORS = [
  "#2965CC",
  "#29A634",
  "#D99E0B",
  "#D13913",
  "#8F398F",
  "#00B3A4",
  "#DB2C6F",
  "#9BBF30",
  "#96622D",
  "#7157D9",
];

// const CHAR_COLORS = ["#1D7324", "#AFC15A", "#93B9A2", "#1F4B99"];
const CHAR_COLORS = ["#4472C4", "#ED7D31", "#A5A5A5", "#70AD47"];

const RADIAN = Math.PI / 180;

export const renderCustomizedLegend = (value: string, entry: any) => {
  return <span className="text-gray-100">{value}</span>;
};

export const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}: {
  cx: any;
  cy: any;
  midAngle: any;
  innerRadius: any;
  outerRadius: any;
  percent: any;
  index: any;
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function Graphs({ data }: { data: SimResults }) {
  const [charSelected, setCharSelected] = React.useState<string>("");

  let dmg: { name: string; value: number }[] = [];
  let dmgDetail: { name: string; value: number }[] = [];
  let useCount: { name: string; value: number }[] = [];
  let useCountDetails: { name: string; value: number }[] = [];
  let fieldTime: { name: string; value: number }[] = [];

  let index = -1;

  //dmg
  data.char_names.forEach((char, i) => {
    let total = 0;
    if (char === charSelected) {
      index = i;
    }
    //add up dmg per char?
    for (const [key, val] of Object.entries(data.damage_by_char[i])) {
      let v = Math.round(val.mean * 100) / 100;
      if (char === charSelected) {
        dmgDetail.push({
          name: key,
          value: v,
        });
      }
      total += v;
    }
    dmg.push({
      name: char,
      value: total,
    });
    //check abil usage
    total = 0;
    for (const [key, val] of Object.entries(data.abil_usage_count_by_char[i])) {
      let v = Math.round(val.mean * 100) / 100;
      if (char === charSelected) {
        useCountDetails.push({
          name: key,
          value: v,
        });
      }
      total += v;
    }
    useCount.push({
      name: char,
      value: total,
    });
    //check field time
    fieldTime.push({
      name: char,
      value: Math.round((100 * data.char_active_time[i].mean) / 60) / 100,
    });
  });

  //reactions

  //over time

  return (
    <div className="m-2 flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-md p-2 pt-10 bg-gray-600 relative">
          <span className="ml-2 mt-1 font-bold capitalize absolute top-0 left-0">
            Average DPS By Character
          </span>
          <ResponsiveContainer width="95%" height={288}>
            <PieChart margin={{ top: 0, left: 0, right: 0, bottom: 0 }}>
              <Tooltip
                formatter={(value: number, name: string) => {
                  return [
                    "" +
                      value.toFixed(2) +
                      " (" +
                      ((100 * value) / data.dps.mean).toFixed(2) +
                      "%)",
                    name,
                  ];
                }}
              />
              <Legend
                verticalAlign="middle"
                align="right"
                layout="vertical"
                height={36}
                formatter={renderCustomizedLegend}
              />
              <Pie
                isAnimationActive={false}
                data={dmg}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius="90%"
                labelLine={false}
                label={renderCustomizedLabel}
                onClick={(e: any) => setCharSelected(e.name)}
              >
                {dmg.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={CHAR_COLORS[index % CHAR_COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-md p-2 pt-10 bg-gray-600 relative">
          <span className="ml-2 mt-1 font-bold capitalize absolute top-0 left-0">
            Average Character Field Time
          </span>
          <ResponsiveContainer width="95%" height={288}>
            <PieChart>
              <Tooltip />
              <Legend
                verticalAlign="middle"
                align="right"
                layout="vertical"
                height={36}
                formatter={renderCustomizedLegend}
              />
              <Pie
                isAnimationActive={false}
                data={fieldTime}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius="90%"
                labelLine={false}
                label={renderCustomizedLabel}
                onClick={(e: any) => setCharSelected(e.name)}
              >
                {useCount.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={CHAR_COLORS[index % CHAR_COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-gray-600 relative rounded-md p-2 pt-10">
        <DPSOverTime data={data} />
      </div>
      {charSelected === "" ? null : (
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-md p-2 pt-10 bg-gray-600 relative">
            <span className="ml-2 mt-1 font-bold capitalize absolute top-0 left-0">
              {charSelected + " - DPS by Ability (Average)"}
            </span>
            <ResponsiveContainer width="95%" height={288}>
              <BarChart data={dmgDetail}>
                <Tooltip />
                <YAxis type="number" dataKey="value" tick={{ fill: "white" }} />
                <XAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: "white" }}
                />
                <Bar
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  isAnimationActive={false}
                >
                  {dmgDetail.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-md p-2 pt-10 bg-gray-600 relative">
            <span className="ml-2 mt-1 font-bold capitalize absolute top-0 left-0">
              {charSelected + " - Ability Usage Count (Average)"}
            </span>
            <ResponsiveContainer width="95%" height={288}>
              <BarChart data={useCountDetails}>
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <XAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: "white" }}
                />
                <YAxis type="number" dataKey="value" tick={{ fill: "white" }} />
                <Bar
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  isAnimationActive={false}
                >
                  {useCountDetails.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-md p-2 pt-10 bg-gray-600 relative">
          <ReactionsTriggered data={data} />
        </div>
        <div className="rounded-md p-2 pt-10 bg-gray-600 relative">
          <ParticlesCount data={data} />
        </div>
      </div>
    </div>
  );
}
