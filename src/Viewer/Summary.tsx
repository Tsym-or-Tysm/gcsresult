import { Graphs } from "./Graphs";
import { SimResults } from "./Viewer";

export function Summary({ data }: { data: SimResults }) {
  const chars = data.char_names.map((e) => {
    return (
      <div key={e}>
        <img src={"/images/avatar/" + e + ".png"} className="w-full h-auto" />
      </div>
    );
  });

  //calculate per target damage
  let trgdps: number[] = [];
  let total = 0;
  for (let i = 1; i <= data.num_targets; i++) {
    let dps = 0;
    data.char_names.forEach((_, ci) => {
      dps += data.damage_by_char_by_targets[ci][i].mean;
    });
    console.log(`target ${i} total: ${dps}`);
    total += dps;

    trgdps.push(dps);
  }

  const trgs = trgdps.map((dps, i) => {
    return (
      <div className="w-full flex flex-row" key={i}>
        <span className="w-24">
          <span className="pl-2" />
          {`Target ${i + 1}:`}
        </span>
        <div className="grid grid-cols-4 grow">
          <span className="text-right">-</span>
          <span className="text-right">
            {dps.toLocaleString(undefined, {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}
          </span>
          <span className="text-right">
            
            {(100 * dps / total).toLocaleString(undefined, {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}{"%"}
          </span>
          <span className="text-right">-</span>
        </div>
      </div>
    );
  });

  return (
    <div>
      <div className="m-2 p-2 rounded-md bg-gray-600 gap-2">
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="grid grid-cols-4">{chars}</div>
          <div className="flex flex-col gap-1">
            <div className="w-full">
              <span>
                Simulated{" "}
                {data.sim_duration.mean.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}{" "}
                sec of combat (took {(data.runtime / 1000000000).toFixed(3)}{" "}
                seconds to run)
              </span>
            </div>
            <div className="max-w-4xl w-full pl-4 flex flex-col gap-1">
              <div className="flex flex-row border-solid border-b-2">
                <span className="w-24">Target</span>
                <div className="grid grid-cols-4 grow">
                  <span className="text-right">Level</span>
                  <span className="text-right">Avg DPS</span>
                  <span className="text-right">%</span>
                  <span className="text-right">std. dev.</span>
                </div>
              </div>
              {trgs}

              <div className="w-full flex flex-row border-solid border-t-2">
                <span className="w-24">Combined</span>
                <div className="grid grid-cols-4 grow">
                  <span className="text-right"></span>
                  <span className="text-right">
                    {" "}
                    {data.dps.mean.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                  </span>
                  <span className="text-right"></span>
                  <span className="text-right">
                    {data.dps.sd?.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Graphs data={data} />
    </div>
  );
}